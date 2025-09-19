import { useEffect, useState } from "react";
import { Loader2Icon, Sparkles } from "lucide-react";
import {
  href,
  useNavigate,
  useNavigation,
  useSearchParams,
} from "react-router";

import Stepper from "./Stepper";
import { Button } from "./ui/button";
import ReviewSubmitModal from "./ReviewSubmitModal";
import { useSettings } from "~/zustand";

export default function Navbar() {
  const [path, setPath] = useState<string>();
  let pathname = "/";

  try {
    pathname = window.location.pathname;
  } catch (error) {
    console.error("Window not defined.");
  }

  useEffect(() => {
    setPath(window.location.pathname);
  }, [pathname]);

  return (
    <header className="bg-background border-b px-4 md:px-6">
      <div className="mx-auto grid h-16 max-w-[1280px] grid-cols-[1fr_auto_1fr] items-center gap-2">
        <PrimaryAction path={path ?? ""} />

        <div className="flex gap-6">
          <Stepper index={1} isActive={path === href("/")}>
            Upload
          </Stepper>
          <Stepper index={2} isActive={path?.includes("/review")}>
            Review
          </Stepper>
          <Stepper index={3} isActive={path?.includes("/submit")}>
            Submit
          </Stepper>
        </div>

        <SecondaryAction path={path ?? ""} />
      </div>
    </header>
  );
}

function PrimaryAction(props: { path: string }) {
  const [searchParams] = useSearchParams();
  const search = searchParams.toString();

  const navigate = useNavigate();

  if (props.path.includes("/review")) {
    <Button
      variant="secondary"
      onClick={() => navigate(href("/") + `?${search}`)}
    >
      Back
    </Button>;
  }

  return (
    <div className="flex items-center gap-2">
      <Sparkles />
      <p>AI Reader</p>
    </div>
  );
}

function SecondaryAction(props: { path: string }) {
  const [searchParams] = useSearchParams();
  const search = searchParams.toString();

  const settings = useSettings();
  const navigate = useNavigate();
  const navigation = useNavigation();

  const isPageSubmitting = navigation.state === "submitting";
  const disableBtn =
    !settings.configRef || !settings.engine || !settings.imgCount;

  if (props.path === href("/")) {
    return (
      <div className="flex">
        <Button
          className="ml-auto"
          size={"sm"}
          type="submit"
          form="upload-form"
          disabled={isPageSubmitting || disableBtn}
        >
          {isPageSubmitting && <Loader2Icon className="animate-spin" />}
          <span>Extract</span>
        </Button>
      </div>
    );
  }

  if (props.path.includes("/review")) {
    return (
      <div className="flex">
        <ReviewSubmitModal />
      </div>
    );
  }

  if (props.path.includes("/submit")) {
    return (
      <div className="flex">
        <Button
          className="ml-auto"
          variant="default"
          onClick={() => navigate(href("/") + `?${search}`)}
        >
          <span>Upload</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex">
      <Button
        className="ml-auto"
        variant="outline"
        onClick={() => navigate(href("/") + `?${search}`)}
      >
        <span>Upload</span>
      </Button>
    </div>
  );
}
