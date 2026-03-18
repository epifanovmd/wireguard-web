import { createServiceDecorator, DataHolder } from "@force-dev/utils";

import { IProfileUpdateRequestDto, ProfileDto } from "~@api/api-gen/data-contracts";

export const IProfileDataStore = createServiceDecorator<IProfileDataStore>();

export interface IProfileDataStore {
  holder: DataHolder<ProfileDto>;
  profile: ProfileDto | undefined;
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  getProfile(): Promise<ProfileDto | undefined>;
  updateProfile(
    data: IProfileUpdateRequestDto,
  ): Promise<{ data: ProfileDto } | { error: Error }>;
}
