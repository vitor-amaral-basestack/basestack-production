import React, { Fragment, useState } from "react";
// Router
import { useRouter } from "next/router";
// Store
// import { useSelector } from "react-redux";
// import { RootState } from "store";
// Auth
import { useSession } from "next-auth/react";
import CreateFlagModal from "../../modals/CreateFlag";
import { Navigation } from "design-system";

const MainLayout: React.FunctionComponent<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/sign-in");
    },
  });

  const [isCreateFlagModalOpen, setIsCreateFlagModalOpen] = useState(false);

  /* const isNavCollapsed = useSelector(
    (store: RootState) => store.app.isNavCollapsed
  ); */

  if (status === "loading") {
    return <div>isLoading</div>;
  }

  return (
    <Fragment>
      <Navigation onCreateFlag={() => setIsCreateFlagModalOpen(true)} />
      <CreateFlagModal
        onCreate={() => setIsCreateFlagModalOpen(false)}
        isModalOpen={isCreateFlagModalOpen}
        onClose={() => setIsCreateFlagModalOpen(false)}
      />
      {children}
    </Fragment>
  );
};

export default MainLayout;