import {
  INotificacao,
} from "@/interfaces/INotificacao";
import { InjectionKey } from "vue";
import {
  createStore,
  Store,
  useStore as vuexUseStore,
} from "vuex";
import { EstadoProjeto, projeto } from "./modulos/projeto";
import { EstadoTarefa, tarefa } from "./modulos/tarefas";
import {
  NOTIFICAR,
} from "./tipo-mutacoes";

export interface Estado {
  tarefa: EstadoTarefa;
  notificacoes: INotificacao[];
  projeto: EstadoProjeto
}

export const key: InjectionKey<Store<Estado>> = Symbol();

export const store = createStore<Estado>({
  state: {
    tarefa: {
      tarefas:[],
    },
    projeto: {
      projetos:[]
    },
    notificacoes: [],
  },
  mutations: {
    
    [NOTIFICAR](state, novaNotificacao: INotificacao) {
      novaNotificacao.id = new Date().getTime();
      state.notificacoes.push(novaNotificacao);

      setTimeout(() => {
        state.notificacoes = [];
      }, 3000);
    },
  },
  actions: {
    
  },
  modules:{
    projeto,
    tarefa
  }
});

export function useStore(): Store<Estado> {
  return vuexUseStore(key);
}
