import axios from "axios";
import { useMutation } from "react-query";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { endFilenameSlicer, multiSlicer } from "../utils/slice";

export const useDownload = (path: string) => {
  const downloadMutation = useMutation(
    async (target: { name: string; type: string }) => {
      const { name, type } = target;
      const res = await axios.get(
        `${
          import.meta.env.VITE_SERVER_URL
        }/download?path=${path}&target=${name}&type=${type}`,
        { responseType: type === "file" ? "blob" : "json" }
      );
      console.log(res);
      switch (type) {
        case "file": {
          saveAs(res.data, name);
          return;
        }
        case "dir": {
          const dirPaths = res.data.paths as string[];
          const dividedPaths = multiSlicer(dirPaths, 1000);
          const zip = new JSZip();
          for (const paths of dividedPaths) {
            for await (const files of requestFiles(paths, name)) {
              files.forEach((file) => zip.file(file.relativePath, file.blob));
            }
          }
          zip.generateAsync({ type: "blob" }).then((content) => {
            saveAs(content, name);
          });
        }
      }
    }
  );

  async function* requestFiles(dirPaths: string[], name: string) {
    const files = await Promise.all(
      dirPaths.map(async (dirPath) => {
        const fileName = endFilenameSlicer(dirPath);
        const relativePath = dirPath.slice(dirPath.indexOf(name));
        const res = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/download?path=${dirPath}&target=${fileName}&type=file`,
          { responseType: "blob" }
        );
        return { blob: res.data as Blob, relativePath: relativePath };
      })
    );
    yield files;
  }

  return {
    downloadMutation,
  };
};
