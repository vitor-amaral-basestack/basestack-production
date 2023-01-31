import React, { useCallback } from "react";
// Router
import { useRouter } from "next/router";
// Form
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// Types
import { HistoryAction } from "types/history";
// Theme
import { useTheme } from "styled-components";
// Components
import Portal from "@basestack/design-system/global/Portal";
import { Modal, InputGroup } from "@basestack/design-system";
// Store
import { useStore } from "store";
// Server
import { trpc } from "libs/trpc";
// Utils
import { generateSlug } from "random-word-slugs";
import { slugify } from "@basestack/utils";
// Hooks
import { useDebounce } from "@basestack/hooks";

export const FormSchema = z.object({
  name: z
    .string()
    .max(30, "Must be 30 characters or less")
    .min(1, "Required field"),
  slug: z
    .string()
    .max(150, "Must be 150 characters or less")
    .min(1, "Required field"),
});

export type FormInputs = z.TypeOf<typeof FormSchema>;

const CreateProjectModal = () => {
  const theme = useTheme();
  const router = useRouter();
  const trpcContext = trpc.useContext();

  const isModalOpen = useStore((state) => state.isCreateProjectModalOpen);
  const setCreateProjectModalOpen = useStore(
    (state) => state.setCreateProjectModalOpen
  );

  const createProject = trpc.project.create.useMutation();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<FormInputs>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
  });

  const watchName = watch("name");

  const onClose = useCallback(() => {
    setCreateProjectModalOpen({ isOpen: false });
    reset();
  }, [reset]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    await createProject.mutate(data, {
      onSuccess: async (result) => {
        // Get all the projects on the cache
        const prev = trpcContext.project.all.getData();

        if (prev && prev.projects) {
          // Add the new project with the others
          const projects = [result.project, ...prev.projects];

          // Update the cache with the new data
          trpcContext.project.all.setData(undefined, { projects });
        }

        onClose();

        await router.push({
          pathname: "/[projectSlug]/flags",
          query: { projectSlug: data.slug },
        });
      },
    });
  };

  useDebounce(
    () => {
      if (watchName) {
        setValue("slug", watchName);
      }
    },
    500,
    [watchName]
  );

  return (
    <Portal selector="#portal">
      <Modal
        title="Create Project"
        expandMobile
        isOpen={isModalOpen}
        onClose={onClose}
        buttons={[
          { children: "Close", onClick: onClose },
          {
            children: "Create",
            onClick: handleSubmit(onSubmit),
          },
        ]}
      >
        <Controller
          name="name"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <InputGroup
              title="Project name"
              hint={errors.name?.message}
              inputProps={{
                type: "text",
                name: field.name,
                value: field.value,
                onChange: field.onChange,
                onBlur: field.onBlur,
                placeholder: "E.g. Chat",
                hasError: !!errors.name,
                isDisabled: isSubmitting,
              }}
              mb={theme.spacing.s6}
            />
          )}
        />
        <Controller
          name="slug"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <InputGroup
              title="Project slug"
              hint={errors.slug?.message}
              inputProps={{
                name: "slug",
                value: slugify(field.value),
                onChange: field.onChange,
                onBlur: field.onBlur,
                placeholder: "pr-chat",
                hasError: !!errors.slug,
                isDisabled: isSubmitting,
              }}
            />
          )}
        />
        <button
          onClick={() => {
            setValue("slug", generateSlug());
          }}
        >
          generate
        </button>
      </Modal>
    </Portal>
  );
};

export default CreateProjectModal;