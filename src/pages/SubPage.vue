<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-green text-white">
      <q-toolbar class="container">
        <q-toolbar-title class="text-weight-bold"> Nutro </q-toolbar-title>
        <q-btn flat label="Voltar" icon="arrow_back" @click="goBack" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="bg-grey-1 flex flex-center">
        <div class="container q-px-md q-py-xl" style="max-width: 700px; width: 100%">
          <q-card class="q-pa-sm shadow-2">
            <q-card-section class="text-center">
              <h1 class="text-h4 text-weight-bolder text-green q-mb-sm">Acesso Beta</h1>
              <p class="text-grey-7 text-subtitle1">
                Sua opinião é fundamental. Preencha os campos abaixo para entrar na lista de
                prioridade.
              </p>
            </q-card-section>

            <q-card-section>
              <q-form @submit="onSubmit" class="q-gutter-y-lg">
                <div>
                  <div class="text-weight-medium q-mb-xs">Seu melhor e-mail</div>
                  <q-input
                    filled
                    v-model="formData.email"
                    placeholder="exemplo@email.com"
                    type="email"
                    color="green"
                    lazy-rules
                    :rules="[(val) => !!val || 'O e-mail é obrigatório']"
                  >
                    <template v-slot:prepend>
                      <q-icon name="email" color="green" />
                    </template>
                  </q-input>
                </div>

                <div class="bg-white q-pa-md rounded-borders border-grey-4">
                  <div class="text-weight-medium q-mb-sm text-grey-9">
                    1. Qual sua satisfação ao usar o protótipo inicial?
                  </div>
                  <q-rating
                    v-model="formData.satisfactionPrototype"
                    size="2.5em"
                    color="green"
                    icon="star_border"
                    icon-selected="star"
                    no-dimming
                  />
                </div>

                <div class="bg-white q-pa-md rounded-borders border-grey-4">
                  <div class="text-weight-medium q-mb-sm text-grey-9">
                    2. O que achou da ideia (IA que sugere receitas pelo perfil)?
                  </div>
                  <q-rating
                    v-model="formData.satisfactionIdea"
                    size="2.5em"
                    color="green"
                    icon="star_border"
                    icon-selected="star"
                    no-dimming
                  />
                </div>

                <div class="bg-white q-pa-md rounded-borders border-grey-4">
                  <div class="text-weight-medium q-mb-sm text-grey-9">
                    3. Satisfação com a atualização automática do seu perfil enquanto conversa?
                  </div>
                  <q-rating
                    v-model="formData.satisfactionAutoUpdate"
                    size="2.5em"
                    color="green"
                    icon="star_border"
                    icon-selected="star"
                    no-dimming
                  />
                </div>

                <div class="text-center q-pt-md">
                  <q-btn
                    label="Quero participar do Beta"
                    type="submit"
                    color="green"
                    size="lg"
                    class="full-width text-weight-bold"
                    icon-right="send"
                  />
                  <p class="q-mt-md text-caption text-grey-6">
                    Ao se cadastrar, você concorda em receber atualizações sobre o lançamento.
                  </p>
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </div>
      </q-page>
    </q-page-container>

    <q-footer class="bg-grey-9 text-white q-pa-md">
      <div class="text-center">
        <div class="text-caption text-grey-5">Nutro - Construindo o futuro da nutrição com IA</div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const loadingSubmit = ref(false)

const formData = reactive({
  email: '',
  satisfactionPrototype: 0,
  satisfactionIdea: 0,
  satisfactionAutoUpdate: 0,
})

const goBack = () => {
  if (window.history.length <= 1) {
    window.close()
  } else {
    window.history.back()
  }
}

const onSubmit = async () => {
  loadingSubmit.value = true
  try {
    // Caso proces.env não envie, substitua direto pela sua string de chave do Web3Forms aqui
    const ACCESS_KEY = '88e3b4e6-b7b0-47ab-9d5f-4c13c59bafca';

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        access_key: ACCESS_KEY,
        subject: '🚀 Inscrição Completa e Feedback do Beta - Nutro',
        email: formData.email,
        satisfacao_uso_prototipo: formData.satisfactionPrototype,
        satisfacao_ideia_geral: formData.satisfactionIdea,
        satisfacao_atualizacao_perfil: formData.satisfactionAutoUpdate,
        deseja_participar_beta: true,
      })
    })

    if (response.ok) {
      $q.notify({
        position: 'top',
        color: 'positive',
        message: 'Sucesso! Você está na lista de prioridades do Beta.',
        icon: 'done_all',
      })

      // Limpa formulário
      formData.email = ''
      formData.satisfactionPrototype = 0
      formData.satisfactionIdea = 0
      formData.satisfactionAutoUpdate = 0
    } else {
      throw new Error('Falha na resposta do servidor')
    }

  } catch (error) {
    console.error('Erro ao enviar feedback completo:', error)
    $q.notify({
      position: 'top',
      color: 'negative',
      message: 'Erro ao enviar. Verifique os dados e tente novamente.',
      icon: 'error',
    })
  } finally {
    loadingSubmit.value = false
  }
}
</script>

<style scoped>
.container {
  max-width: 1100px;
  margin: 0 auto;
}

/* Estilo para simular borda leve nos grupos de perguntas */
.border-grey-4 {
  border: 1px solid #e0e0e0;
}

/* Efeito hover no card para manter consistência com sua landing page */
.q-card {
  transition: transform 0.3s;
}

@media (max-width: 800px) {
  .text-h4 {
    font-size: 1.5rem;
  }
}
</style>
