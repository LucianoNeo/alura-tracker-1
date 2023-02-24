import clienteHttp from "@/http";
import {
  INotificacao,
} from "@/interfaces/INotificacao";
import IProjeto from "@/interfaces/IProjeto";
import ITarefa from "@/interfaces/ITarefa";
import { InjectionKey } from "vue";
import {
  createStore,
  Store,
  useStore as vuexUseStore,
} from "vuex";
import { ALTERAR_TAREFA, CADASTRAR_PROJETO, CADASTRAR_TAREFA, OBTER_PROJETOS, OBTER_TAREFAS, REMOVER_PROJETO, REMOVER_TAREFA } from "./tipo-acoes";
import {
  ADICIONA_PROJETO,
  ADICIONA_TAREFA,
  ALTERA_PROJETO,
  ALTERA_TAREFA,
  DEFINIR_PROJETOS,
  DEFINIR_TAREFAS,
  EXCLUIR_PROJETO,
  NOTIFICAR,
} from "./tipo-mutacoes";

interface Estado {
  tarefas: ITarefa[];
  projetos: IProjeto[];
  notificacoes: INotificacao[];
}

export const key: InjectionKey<Store<Estado>> = Symbol();

export const store = createStore<Estado>({
  state: {
    tarefas: [],
    projetos: [],
    notificacoes: [],
  },
  mutations: {
    [ADICIONA_PROJETO](state, nomeDoProjeto: string) {
      const projeto = {
        id: new Date().toISOString(),
        nome: nomeDoProjeto,
      } as IProjeto;
      state.projetos.push(projeto);
    },
    [ALTERA_PROJETO](state, projeto: IProjeto) {
      const index = state.projetos.findIndex((proj) => proj.id == projeto.id);
      state.projetos[index] = projeto;
    },
    [EXCLUIR_PROJETO](state, id: string) {
      state.projetos.filter((proj) => proj.id != id);
    },
    [DEFINIR_PROJETOS](state, projetos: IProjeto[]) {
      state.projetos = projetos
    },
    [DEFINIR_TAREFAS](state, tarefas: ITarefa[]) {
      state.tarefas = tarefas
    },

    [ADICIONA_TAREFA](state, tarefa: ITarefa) {
      state.tarefas.push(tarefa);
    },
    [ALTERA_TAREFA](state, tarefa: ITarefa) {
      const index = state.tarefas.findIndex((item) => item.id == tarefa.id);
      state.tarefas[index] = tarefa;
    },
    [EXCLUIR_PROJETO](state, id: string) {
      state.projetos.filter((proj) => proj.id != id);
    },

    [NOTIFICAR](state, novaNotificacao: INotificacao) {
      novaNotificacao.id = new Date().getTime();
      state.notificacoes.push(novaNotificacao);

      setTimeout(() => {
        state.notificacoes = [];
      }, 3000);
    },
  },
  actions: {
    [OBTER_PROJETOS]({ commit }) {
      clienteHttp.get("projetos")
      .then((resposta) => commit(DEFINIR_PROJETOS, resposta.data));
      
    },
    [CADASTRAR_PROJETO](contexto, nomeDoProjeto: string) {
      return clienteHttp.post("projetos",{
        nome: nomeDoProjeto
      })
    },
    [ALTERA_PROJETO](contexto, projeto: IProjeto) {
      return clienteHttp.put(`projetos/${projeto.id}`,projeto)
    },
    [REMOVER_PROJETO]({ commit }, id: string) {
      return clienteHttp.delete(`projetos/${id}`)
      .then(()=> commit(EXCLUIR_PROJETO,id))
    },

    [OBTER_TAREFAS]({ commit }) {
      clienteHttp.get("tarefas")
      .then((resposta) => commit(DEFINIR_TAREFAS, resposta.data));
      
    },
    [CADASTRAR_TAREFA]({commit}, tarefa: ITarefa) {
      return clienteHttp.post("tarefas",tarefa)
      .then((resposta)=>commit(ADICIONA_TAREFA,resposta.data))
    },
    [ALTERAR_TAREFA]({commit}, tarefa: ITarefa) {
      return clienteHttp.put(`tarefas/${tarefa.id}`,tarefa)
      .then(()=>commit(ALTERA_TAREFA,tarefa))
    },
    [REMOVER_TAREFA]({ commit }, id: string) {
      return clienteHttp.delete(`tarefas/${id}`)
      .then(()=> commit(EXCLUIR_PROJETO,id))
    },
  },
});

export function useStore(): Store<Estado> {
  return vuexUseStore(key);
}
