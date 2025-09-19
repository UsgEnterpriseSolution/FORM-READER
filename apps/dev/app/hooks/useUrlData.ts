// import { useEffect } from "react";
// import { useSearchParams } from "react-router";
// import { useActions } from "~/zustand";

// export default function useUrlData() {
//   const [searchParams] = useSearchParams();
//   const formCode = searchParams.get("formCode");
//   const branchCode = searchParams.get("branchCode");
//   const username = searchParams.get("username");

//   const { setSettings } = useActions();

//   useEffect(() => {
//     setSettings({ key: "formCode", value: formCode });
//     setSettings({ key: "branchCode", value: branchCode });
//     setSettings({ key: "username", value: username });
//   }, [branchCode, username]);
// }
