import { AxiosInstance } from 'axios'
export class UploadApi {
  constructor(private readonly request: AxiosInstance) {}

  /**
   * 上传头像
   * @param headPic 头像文件
   * @returns
   */
  async uploadHeadPic(headPic: any) {
    return await this.request.post('/api/upload/headPic', headPic)
  }
}
