import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { FileService } from './file.service';

@Resolver()
export class FileResolver {
  constructor(
    private readonly fileService: FileService, //
  ) {}

  // 회원이미지 업로드
  @Mutation(() => String)
  async userImageUpload(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload, //
  ) {
    console.log(file);

    return await this.fileService.ImageUpload({ file });
  }
}
