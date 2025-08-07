import { createServiceDecorator, DataHolder } from "@force-dev/utils";

import { IProfileDto } from "~@api/api-gen/data-contracts";

export const IProfileDataStore = createServiceDecorator<IProfileDataStore>();

export interface IProfileDataStore {
  holder: DataHolder<IProfileDto>;
  profile?: IProfileDto;
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  isAdmin: boolean;

  getProfile(): Promise<IProfileDto | undefined>;
}
