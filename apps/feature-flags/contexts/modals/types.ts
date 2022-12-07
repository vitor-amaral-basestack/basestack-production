import React from "react";
import { inferQueryOutput } from "libs/trpc";

export interface OpenFlagModalPayload {
  isOpen: boolean;
  isEdit: boolean;
  data?: {
    flagId: string;
    selectedTab: string;
    selectedEnvId: string;
  } | null;
}

export interface OpenEnvironmentModalPayload {
  isOpen: boolean;
  data: {
    environment?: { id: string };
    project: inferQueryOutput<"project.bySlug">["project"];
  } | null;
}

export interface ModalsState {
  isDemoModalOpen: boolean;
  isCreateEnvironmentModalOpen: boolean;
  isUpdateEnvironmentModalOpen: boolean;
  isInviteMemberModalOpen: boolean;
  isCreateProjectModalOpen: boolean;
  isFlagModalOpen: boolean;
  flagModalPayload: Pick<OpenFlagModalPayload, "isEdit" | "data">;
  environmentModalPayload: Pick<OpenEnvironmentModalPayload, "data">;
}

export interface OpenDemoModalAction {
  type: "DEMO_MODAL_OPEN";
  payload: {
    isOpen: boolean;
  };
}

export interface OpenCreateEnvironmentModalAction {
  type: "CREATE_ENVIRONMENT_MODAL_OPEN";
  payload: OpenEnvironmentModalPayload;
}

export interface OpenUpdateEnvironmentModalAction {
  type: "UPDATE_ENVIRONMENT_MODAL_OPEN";
  payload: OpenEnvironmentModalPayload;
}

export interface OpenInviteMemberModalAction {
  type: "INVITE_MEMBER_MODAL_OPEN";
  payload: {
    isOpen: boolean;
  };
}

export interface OpenCreateProjectModalAction {
  type: "CREATE_PROJECT_MODAL_OPEN";
  payload: {
    isOpen: boolean;
  };
}

export interface OpenFlagModalAction {
  type: "FLAG_MODAL_OPEN";
  payload: OpenFlagModalPayload;
}

export type ModalsActions =
  | OpenDemoModalAction
  | OpenCreateEnvironmentModalAction
  | OpenUpdateEnvironmentModalAction
  | OpenInviteMemberModalAction
  | OpenCreateProjectModalAction
  | OpenFlagModalAction;

export interface Context {
  state: ModalsState;
  dispatch: React.Dispatch<ModalsActions>;
}