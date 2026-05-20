<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-green text-white">
      <q-toolbar class="container">
        <q-toolbar-title class="text-weight-bold"> Nutro </q-toolbar-title>

        <q-btn flat label="Como funciona" @click="scrollToElement('como-funciona')" />
        <q-btn color="black" label="Testar Protótipo" @click="openPrototype" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page>
        <section class="hero-section bg-grey-1 q-py-xl text-center">
          <div class="container q-px-md">
            <h1 class="text-h2 text-weight-bolder q-mb-md title_custom">
              Sua dieta sugerida por <span class="text-green">IA</span>,<br />
              sem preencher formulários.
            </h1>
            <p class="text-h6 text-grey-7 q-mx-auto subtitle_custom" style="max-width: 800px">
              O Nutro aprende com você através de conversas. Esqueça as listas manuais de
              ingredientes e objetivos. Nosso
              <span style="text-decoration: underline dotted">Nutricionista Inteligente</span>
              entende sua rotina, seu bolso e seu paladar em poucos minutos.
            </p>
            <div class="q-mt-xl">
              <q-btn
                size="lg"
                color="green"
                label="Testar Agora"
                icon="rocket_launch"
                @click="openPrototype"
              />
              <q-btn
                size="lg"
                flat
                color="green"
                label="Saiba mais"
                class="q-ml-sm"
                @click="scrollToElement('diferenciais')"
              />
            </div>
          </div>
        </section>

        <section id="diferenciais" class="q-py-xl">
          <div class="container text-center">
            <h2 class="text-h4 q-mb-xl">Por que o Nutro é diferente?</h2>
            <div class="row q-col-gutter-lg">
              <div class="col-12 col-md-4">
                <q-card bordered class="my-card">
                  <q-card-section>
                    <q-icon name="psychology" size="xl" color="green" />
                    <div class="text-h6 q-mt-md">Onboarding em 2 Minutos</div>
                    <div class="text-body2 text-grey-8">
                      Nada de telas extensas de perfil. Responda algumas perguntas curtas e o chat
                      já estará pronto para você.
                    </div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-12 col-md-4">
                <q-card bordered class="my-card">
                  <q-card-section>
                    <q-icon name="payments" size="xl" color="green" />
                    <div class="text-h6 q-mt-md">Contexto Socioeconômico</div>
                    <div class="text-body2 text-grey-8">
                      Nossa IA entende sutilmente suas preferências e orçamento, sugerindo desde
                      receitas simples até ingredientes premium de forma orgânica.
                    </div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-12 col-md-4">
                <q-card bordered class="my-card">
                  <q-card-section>
                    <q-icon name="auto_fix_high" size="xl" color="green" />
                    <div class="text-h6 q-mt-md">Perfil Evolutivo</div>
                    <div class="text-body2 text-grey-8">
                      Suas preferências são atualizadas em tempo real enquanto você conversa. O app
                      aprende o que você gosta sem você precisar editar nada manualmente.
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </section>

        <section id="como-funciona" class="bg-green text-white q-py-xl">
          <div class="container text-center">
            <h2 class="text-h4 q-mb-lg">Nutrição Inteligente na prática</h2>
            <p class="text-subtitle1 q-mb-xl">
              O assistente que acompanha sua rotina e decide com você.
            </p>
            <div class="row items-center q-col-gutter-xl">
              <div class="col-12 col-md-6">
                <q-img
                  src="../assets/mockup.png"
                  class="rounded-borders shadow-3"
                  style="width: 95%"
                />
              </div>
              <div class="col-12 col-md-6 text-center">
                <div class="q-mb-md">
                  <div class="text-h6"><q-badge label="1" rounded /> Converse Naturalmente</div>
                  <p class="text-body1">
                    "Preciso de um jantar rápido para hoje, estou cansado e quero algo leve."
                  </p>
                </div>
                <div class="q-mb-md">
                  <div class="text-h6"><q-badge label="2" rounded /> IA Processa e Adapta</div>
                  <p class="text-body1">
                    O bot analisa seu histórico, metas nutricionais e sugere a receita perfeita
                    baseada no seu tempo disponível.
                  </p>
                </div>
                <div class="q-mt-xl text-center">
                  <q-btn
                    color="white"
                    text-color="green"
                    label="Ver protótipo em ação"
                    @click="openPrototype"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="q-py-xl text-center">
          <div class="container" style="max-width: 600px">
            <h2 class="text-h4 q-mb-md">Quer receber acesso à uma versão mais completa?</h2>
            <p class="q-mb-lg text-grey-7">
              Estamos selecionando um grupo restrito para testar uma versão avançada do nosso
              aplicativo. Deixe seu contato e ajude a construir o futuro da nutrição.
            </p>
            <q-btn
              label="Solicitar Acesso Antecipado"
              color="secondary"
              @click="$router.push('/sub')"
            />
          </div>
        </section>
      </q-page>
    </q-page-container>

    <q-footer class="bg-grey-9 text-white q-pa-md">
      <div class="text-center">
        <div>© 2026 Nutro - MVP</div>
        <div class="text-caption text-grey-5">Focado em ODS 3 - Saúde e Bem-Estar</div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { scroll } from 'quasar'

const { getScrollTarget, setVerticalScrollPosition } = scroll

const scrollToElement = (id) => {
  const el = document.getElementById(id)
  const target = getScrollTarget(el)
  const offset = el.offsetTop - 25
  const duration = 200
  setVerticalScrollPosition(target, offset, duration)
}

const openPrototype = () => {
  window.open('/chatbot', '_blank')
}
</script>

<style scoped>
.container {
  max-width: 1100px;
  margin: 0 auto;
}
.hero-section {
  padding-top: 100px;
  padding-bottom: 100px;
}
.my-card {
  padding: 8px;
  margin: 0 8px;
  height: 100%;
  transition: transform 0.3s;
}
.my-card:hover {
  transform: translateY(-5px);
}

@media (max-width: 800px) {
  .hero-section {
    margin-top: -48px;
  }
  .title_custom {
    font-size: 46px;
    line-height: normal;
  }
  .subtitle_custom {
    font-size: 22px;
    line-height: normal;
  }
}
</style>
