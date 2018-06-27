import {
    IUserCredentials,
    IOnpremiseUserCredentials,
    IOnpremiseFbaCredentials,
    IOnPremiseAddinCredentials,
    IOnlineAddinCredentials,
    IAdfsUserCredentials
  } from "node-sp-auth";
  export let onlineUrl: string = "https://esquel.sharepoint.com/sites/ead/tts_sit";
  export let onlineWithAdfsCreds: IUserCredentials = {
    username: "guoqian@esquel.com",
    password: "*****"
  };