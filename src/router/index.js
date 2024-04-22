import { createRouter, createWebHistory } from "vue-router";
import TestView from "../views/TestView.vue";
import CreateAccountView from "../views/CreateAccountView.vue";
import BoredRoomView from "../views/BoredRoomView.vue";
import LoginView from "../views/LoginView.vue";
import SignupWithCodeView from "../views/SignupWithCodeView.vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import API from "../axiosConfig";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: SignupWithCodeView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/test",
      name: "test",
      component: TestView,
    },
    {
      path: "/signup-with-code",
      name: "signupWithCode",
      component: SignupWithCodeView,
    },
    {
      path: "/createAccount",
      name: "createAccount",
      component: CreateAccountView,
      beforeEnter: (to, from, next) => {
        const validCode = localStorage.getItem("validCode");
        if (validCode) {
          next(); // Continuer vers la page de création de compte
        } else {
          toast.error(
            "Vous n'avez pas accès à cette page sans un code valide.",
            {
              autoClose: 5000,
            }
          );
          next(false); // Bloquer la navigation si aucun code valide n'est trouvé
        }
      },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },

    {
      path: "/boredRoom",
      name: "boredRoom",
      component: BoredRoomView,
      beforeEnter: async (to, from, next) => {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Accès refusé. Veuillez vous connecter svp.");
          next({ name: "login" }); // Redirect to login if no token found
          return; // Stop execution if there's no token
        }

        try {
          // The token is automatically included by the Axios interceptor
          await API.post("/validate-token");
          next(); // If the token is valid, continue
        } catch (error) {
          console.error("Error validating token:", error);
          toast.error("Accès refusé. Veuillez vous connecter svp.");
          next({ name: "login" }); // Redirect to login if token validation fails
        }
      },
    },
  ],
});

export default router;
