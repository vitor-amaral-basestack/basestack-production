import React from "react";
// Store
import { useStore } from "store";
// Components
import SettingCard from "../SettingCard";
// Server
import { trpc } from "libs/trpc";
// Router
import { useRouter } from "next/router";
// Types
import { ProjectSettings } from "types";

type Props = ProjectSettings;

const DeleteProjectCard = ({ project }: Props) => {
  const router = useRouter();
  const trpcContext = trpc.useContext();
  const deleteProject = trpc.project.delete.useMutation();
  const setConfirmModalOpen = useStore((state) => state.setConfirmModalOpen);

  const onDeleteProject = () => {
    deleteProject.mutate(
      {
        projectId: project.id,
      },
      {
        onSuccess: async (result) => {
          // Get all the projects on the cache
          const prev = trpcContext.project.all.getData();

          if (prev && prev.projects) {
            // Find the project and remove from the list
            const projects = prev.projects.filter(
              (project) => project.id !== result.project.id,
            );

            // Update the cache with the new data
            trpcContext.project.all.setData(undefined, { projects });
          }

          await router.replace("/");
        },
      },
    );
  };

  const onClickDeleteProject = () => {
    setConfirmModalOpen({
      isOpen: true,
      data: {
        title: "Are you sure?",
        description: `This action cannot be undone. This will permanently delete the <b>${project.name}</b> project, flags, history and remove all collaborator associations. `,
        type: "delete",
        buttonText: "Delete Project",
        onClick: () => {
          onDeleteProject();
          setConfirmModalOpen({
            isOpen: false,
          });
        },
      },
    });
  };

  return (
    <SettingCard
      title="Delete Project"
      description="The project will be permanently deleted, including its environments and feature flags."
      button="Delete"
      onClick={onClickDeleteProject}
      text="Warning: This action is not reversible. Please be certain."
      isDisabled={deleteProject.isLoading}
      variant="danger"
      isLoading={deleteProject.isLoading}
    />
  );
};

export default DeleteProjectCard;