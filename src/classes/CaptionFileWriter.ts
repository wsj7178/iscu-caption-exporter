import { writeFile } from 'fs/promises'

export class CaptionFileWriter {
  public caption: string = ''

  public addCaption(caption: string) {
    this.caption += caption
  }

  public writeFileToCaption() {
    return writeFile('./data/caption.txt', this.caption)
  }
}

export const captionFileWriter = new CaptionFileWriter()
