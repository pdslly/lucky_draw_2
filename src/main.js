import { createApp } from "vue";
import "element-plus/dist/index.css";
import "@/assets/css/style.scss";
import App from "./App.vue";
import FitScreen from '@fit-screen/vue'

const app = createApp(App)
app.use(FitScreen)
app.mount(document.body)
