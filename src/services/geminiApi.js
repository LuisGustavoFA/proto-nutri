import OpenAI from 'openai'
import { reactive } from 'vue'

export const userPreferences = reactive({
  objetivosSaude: [],
  preferenciasAlimentares: [],
  estiloVidaTreino: [],
  necessidadesEspecificas: [],
  cozinhaOrcamento: [],
})

export let userHistory = []

const client = new OpenAI({
  apiKey: process.env.GROQ_KEY,
  dangerouslyAllowBrowser: true,
  baseURL: 'https://api.groq.com/openai/v1',
})

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
  const systemInstruction = `Você é o Nutricionista Inteligente, um assistente especializado em saúde e culinária.
Sua missão atual é guiar o usuário através de um Onboarding estrito de 4 passos, de forma curta e simpática.

Preferências atuais do usuário: ${JSON.stringify(userPreferences)}
Histórico da conversa: ${JSON.stringify(userHistory)}

ROTEIRO ESTRITO DE ONBOARDING:
- O Passo 1 já foi feito no início ("Quais são seus objetivos de saúde e rotina de exercícios?").
- Se o usuário respondeu ao Passo 1: Extraia as informações e gere a pergunta do Passo 2: "Ótimo! Você tem alguma restrição alimentar, alergia, alimentos que odeia ou condição específica (ex: vegano, diabetes, não gosta de alface)?"
- Se o usuário respondeu ao Passo 2: Extraia as informações e gere a pergunta do Passo 3: "Muito bem! Próxima pergunta, você realiza atividades físicas ou treina? PS. Sinta-se a vontade para adicionar qualquer necessidade específica a qualquer momento!"
- Se o usuário respondeu ao Passo 3: Extraia as informações e gere a pergunta do Passo 4: "Perfeito! Por fim, como é sua relação com a cozinha? Tem bastante tempo ou a rotina é corrida? Qual o orçamento e você usa Air Fryer ou outros aparelhos?"
- Se o usuário respondeu ao Passo 4: Extraia as informações e responda com o Passo Final: "Tudo configurado! 🎉 Que tal solicitar uma receita agora que conheço suas preferências?"
- Se o onboarding já terminou, responda normalmente simulando o nutricionista, gerando receitas baseadas nas preferências.

REGRA CRÍTICA DE SAÍDA:
Você deve responder APENAS com um objeto JSON válido. Não coloque saudações ou textos fora do JSON.
Formato obrigatório:
{
  "extractedPreferences": {
    "objetivosSaude": [],
    "preferenciasAlimentares": [],
    "estiloVidaTreino": [],
    "necessidadesEspecificas": [],
    "cozinhaOrcamento": []
  },
  "botReply": "Texto da sua resposta aqui, formatado em Markdown (use \\n para quebras de linha no JSON)."
}

Instruções para o preenchimento:
- Em 'extractedPreferences', preencha apenas os arrays das categorias cujas informações foram fornecidas na última mensagem do usuário. Mantenha vazio o que não foi mencionado.
- Mapeie corretamente os dados informados para as categorias correspondentes (ex: dispor de tempo e orçamento baixo vai em cozinhaOrcamento; não fazer exercícios vai em estiloVidaTreino).`

  try {
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: promptA },
      ],
      temperature: 0,
    })

    const text = completion.choices[0].message.content
    const parsed = tryParseJSON(text)

    if (parsed && parsed.botReply) {
      // Mescla as preferências extraídas dinamicamente no objeto reativo
      if (parsed.extractedPreferences) {
        for (const [categoria, itens] of Object.entries(parsed.extractedPreferences)) {
          if (userPreferences[categoria] !== undefined && Array.isArray(itens) && itens.length > 0) {
            userPreferences[categoria] = [...new Set([...userPreferences[categoria], ...itens])]
          }
        }
      }
      return parsed.botReply
    }

    // Fallback de segurança se o modelo falhar na formatação estruturada
    return text
  } catch (error) {
    console.error('Erro na chamada da API:', error)
    throw error
  }
}
