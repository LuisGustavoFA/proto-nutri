import OpenAI from 'openai'
import { reactive } from 'vue'

export const userPreferences = reactive({
  objetivosSaude: [
    'Perder peso',
    'Ganhar massa muscular',
    'Melhorar sono',
    'Aumentar energia',
    'Reduzir estresse',
  ],
  preferenciasAlimentares: ['Vegetariano', 'Vegano', 'Low carb', 'Sem lactose', 'Sem glúten'],
  estiloVidaTreino: [
    'Sedentário',
    'Treino leve (1-2x semana)',
    'Treino moderado (3-4x)',
    'Treino intenso (5x+)',
    'Rotina corrida',
  ],
  necessidadesEspecificas: [
    'Diabetes',
    'Hipertensão',
    'Colesterol alto',
    'Problemas digestivos',
    'Alergias alimentares',
  ],
  cozinhaOrcamento: [
    'Médio orçamento',
    'Prefere receitas rápidas',
    'Gosta de cozinhar',
    'Pouco tempo disponível',
    'Usa air fryer',
  ],
})

export let userHistory = []

const client = new OpenAI({
  apiKey: process.env.GROQ_KEY,
  dangerouslyAllowBrowser: true,
  baseURL: 'https://api.groq.com/openai/v1',
})

async function retry(fn, retries = 5, delay = 1000) {
  try {
    return await fn()
  } catch (err) {
    if (retries === 0) throw err
    const jitter = delay * (0.5 + Math.random())
    await new Promise((r) => setTimeout(r, jitter))
    return retry(fn, retries - 1, delay * 2)
  }
}

function tryParseJSON(text) {
  try {
    const cleanText = text.replace(/```json|```/g, '').trim()
    const jsonStart = cleanText.indexOf('{')
    const jsonEnd = cleanText.lastIndexOf('}')
    if (jsonStart !== -1 && jsonEnd !== -1) {
      return JSON.parse(cleanText.slice(jsonStart, jsonEnd + 1))
    }
    return null
  } catch {
    return null
  }
}

export default async function runGroq(promptA) {
  const intro = `Você é o Nutricionista Inteligente, um assistente especializado em saúde e culinária.
Sempre personalize suas respostas com base nestas preferências do usuário:
${JSON.stringify(userPreferences)}. Também leve em consideração o histórico de mensagens do usuário para evitar repetições e melhorar suas respostas: ${JSON.stringify(userHistory)}. NUNCA REPITA RECEITAS`

  const outputRules = `
REGRAS DE RESPOSTA:
- Conversa/Receitas: Use texto natural e Markdown.
- Alteração de Preferências: Se o usuário pedir para mudar algo (ex: "mudar orçamento para alto"), responda APENAS com o JSON:

{
  "functionCall": {
    "name": "updatePreferences",
    "args": {
      "categoria": "nome_da_categoria",
      "itens": ["item1", "item2", "..."]
    }
  }
}

INSTRUÇÕES CRÍTICAS PARA O ARRAY 'itens':
1. ITENS MUTUAMENTE EXCLUSIVOS: Se o usuário mudar o orçamento (Baixo, Médio, Alto), substitua o valor antigo pelo novo.
2. PRESERVAÇÃO: Você deve manter TODOS os outros itens da categoria que não foram mencionados para exclusão (ex: se mudar o orçamento, mantenha "Usa air fryer", "Gosta de cozinhar", etc).
3. INTEGRIDADE: O campo 'itens' deve ser a lista FINAL e COMPLETA da categoria.`

  const systemInstruction = `${intro}\n${outputRules}`

  const completion = await retry(() =>
    client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: promptA },
      ],
      temperature: 0,
    }),
  )

  const text = completion.choices[0].message.content
  const parsed = tryParseJSON(text)

  const isUpdate = parsed?.functionCall?.name === 'updatePreferences' || parsed?.updatePreferences

  if (isUpdate) {
    const call = parsed.functionCall || parsed.updatePreferences
    const categoria = call.args?.categoria || call.name
    const itens = call.args?.itens || call.itens

    if (userPreferences[categoria] && Array.isArray(itens)) {
      userPreferences[categoria] = itens
    }

    const confirmation = await retry(() =>
      client.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content:
              'Você é o Nutricionista Inteligente. Confirme a atualização das preferências de forma curta e simpática, listando como ficou a categoria agora.',
          },
          {
            role: 'user',
            content: `Ação: ${categoria} atualizada. Novos itens: ${itens.join(', ')}. Pedido original: "${promptA}".`,
          },
        ],
        temperature: 0.3,
      }),
    )

    return confirmation.choices[0].message.content
  }

  return text
}
