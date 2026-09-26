import { create } from "zustand";
import type { NavigateFunction } from "react-router-dom";

export type ScrollTargetType = "top" | "project" | "section" | "position";

export interface ScrollTarget {
  type: ScrollTargetType;
  id?: string;
  y?: number;
}

interface AppNavigationState {
  // Modal State
  selectedSkillId: string | null;

  // Origin & Scroll Memory
  fromSkillId: string | null;
  savedScrollY: number | null;
  lastProjectId: string | null;
  scrollTarget: ScrollTarget | null;

  // Modal Actions
  openSkillModal: (skillId: string) => void;
  closeSkillModal: () => void;

  // Centralized Navigation Actions
  navigateToProject: (
    navigate: NavigateFunction,
    projectId: string,
    options?: { fromSkillId?: string }
  ) => void;
  navigateBackFromProject: (
    navigate: NavigateFunction,
    currentProjectId?: string
  ) => void;
  syncOnReturnToHome: () => void;
  navigateToSection: (
    navigate: NavigateFunction,
    sectionId?: string,
    currentPathname?: string
  ) => void;
  executeScrollRestoration: () => void;
}

export const useAppStore = create<AppNavigationState>((set, get) => ({
  selectedSkillId: null,
  fromSkillId: null,
  savedScrollY: null,
  lastProjectId: null,
  scrollTarget: null,

  openSkillModal: (skillId: string) => {
    const currentScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    set({
      selectedSkillId: skillId,
      savedScrollY: currentScrollY > 0 ? currentScrollY : get().savedScrollY,
    });
  },

  closeSkillModal: () => {
    set({
      selectedSkillId: null,
      fromSkillId: null,
    });
  },

  navigateToProject: (navigate, projectId, options) => {
    const currentScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const fromSkill = options?.fromSkillId ?? null;
    const scrollYToSave = currentScrollY > 0 ? currentScrollY : get().savedScrollY;

    set({
      fromSkillId: fromSkill,
      lastProjectId: projectId,
      savedScrollY: scrollYToSave,
      scrollTarget: { type: "top" },
    });

    navigate(`/project/${projectId}`);
  },

  syncOnReturnToHome: () => {
    const { fromSkillId, savedScrollY, lastProjectId } = get();

    if (fromSkillId) {
      set({
        selectedSkillId: fromSkillId,
        scrollTarget: {
          type: "section",
          id: fromSkillId,
          y: savedScrollY ?? undefined,
        },
      });
    } else if (lastProjectId) {
      set({
        selectedSkillId: null,
        scrollTarget: {
          type: "project",
          id: lastProjectId,
          y: savedScrollY ?? undefined,
        },
      });
    } else if (savedScrollY !== null && savedScrollY !== undefined && savedScrollY > 0) {
      set({
        scrollTarget: {
          type: "position",
          y: savedScrollY,
        },
      });
    }

    get().executeScrollRestoration();
  },

  navigateBackFromProject: (navigate, currentProjectId) => {
    if (currentProjectId) {
      set({ lastProjectId: currentProjectId });
    }
    get().syncOnReturnToHome();
    navigate("/");
  },

  navigateToSection: (navigate, sectionId, currentPathname) => {
    const isHome = !sectionId || sectionId === "home";
    const targetId = isHome ? undefined : sectionId;
    const isAlreadyOnHome = !currentPathname || currentPathname === "/";

    if (isHome) {
      set({ scrollTarget: { type: "top" } });
      if (isAlreadyOnHome) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/");
      }
      return;
    }

    set({
      scrollTarget: { type: "section", id: targetId },
    });

    if (isAlreadyOnHome) {
      const el = document.getElementById(targetId!);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      navigate("/");
    }
  },

  executeScrollRestoration: () => {
    const { scrollTarget, savedScrollY } = get();
    if (!scrollTarget && (savedScrollY === null || savedScrollY === undefined)) return;

    const perform = () => {
      const prevOverflow =
        typeof document !== "undefined" ? document.body.style.overflow : "";
      if (prevOverflow === "hidden") {
        document.body.style.overflow = "unset";
      }

      let restored = false;

      if (scrollTarget?.type === "top") {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        restored = true;
      } else {
        const explicitY = scrollTarget?.y ?? savedScrollY;
        if (explicitY !== null && explicitY !== undefined && explicitY > 0) {
          window.scrollTo({ top: explicitY, left: 0, behavior: "instant" });
          restored = true;
        } else if (scrollTarget?.id) {
          const el =
            document.getElementById(scrollTarget.id) ||
            document.getElementById(`project-card-${scrollTarget.id}`);
          if (el) {
            el.scrollIntoView({ behavior: "instant", block: "center" });
            restored = true;
          }
        }
      }

      if (prevOverflow === "hidden") {
        document.body.style.overflow = "hidden";
      }

      return restored;
    };

    perform();
    const raf1 = requestAnimationFrame(perform);
    const t1 = setTimeout(perform, 30);
    const t2 = setTimeout(perform, 100);
    const t3 = setTimeout(perform, 250);
    const t4 = setTimeout(perform, 450);
    const t5 = setTimeout(perform, 650);
    const t6 = setTimeout(perform, 850);

    setTimeout(() => {
      cancelAnimationFrame(raf1);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      set({ scrollTarget: null });
    }, 950);
  },
}));

