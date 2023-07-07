// Store
import store from "./store";
// Utils
import fetch from "isomorphic-unfetch";
import { verifyFlag } from "./utils/helpers";
// Types
import { Params, FlagResult, Flag } from "./types";

class FlagsJS {
  private readonly apiUrl: string;
  private readonly projectKey: string;
  private readonly envKey: string;
  public isInitialized: boolean = false;

  constructor({ apiUrl, projectKey, envKey }: Params) {
    this.apiUrl = apiUrl;
    this.projectKey = projectKey;
    this.envKey = envKey;
  }

  async initialize() {
    await this.flagsAsync();
    this.isInitialized = true;
  }

  async flagsAsync(): Promise<Flag[]> {
    try {
      const { setFlags } = store.getState();
      const url = `${this.apiUrl}/${this.projectKey}/${this.envKey}/flags`;

      const response = await fetch(url);
      const { flags } = await response.json();

      // Update the store
      setFlags(flags);

      // Return the flags
      return flags;
    } catch (e) {
      throw e;
    }
  }

  async flagAsync(slug: string): Promise<FlagResult<Flag | null>> {
    try {
      const url = `${this.apiUrl}/${this.projectKey}/${this.envKey}/flags`;
      const response = await fetch(url);
      const { flags } = await response.json();
      return verifyFlag(flags, slug);
    } catch (e) {
      throw e;
    }
  }

  flags(): Flag[] {
    const { flags } = store.getState();
    return flags;
  }

  flag(slug: string): FlagResult<Flag | null> {
    const { flags } = store.getState();
    return verifyFlag(flags, slug);
  }
}

export default FlagsJS;
