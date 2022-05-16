import { InputType, OmitType } from '@nestjs/graphql';
import { ProjectAddress } from '../entities/projectAddress.entity';

@InputType()
export class ProjectAddressInput extends OmitType(
  ProjectAddress,
  ['projectAddressId'],
  InputType,
) {}
