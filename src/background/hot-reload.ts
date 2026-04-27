// Simple hot-reload script
const filesInDirectory = (dir: any) =>
  new Promise((resolve) =>
    dir.createReader().readEntries((entries: any) =>
      Promise.all(
        entries
          .filter((e: any) => e.name[0] !== '.')
          .map((e: any) =>
            e.isDirectory ? filesInDirectory(e) : new Promise((resolve) => e.file(resolve))
          )
      )
        .then((files) => [].concat(...(files as any)))
        .then(resolve)
    )
  );

const timestampForFilesInDirectory = (dir: any) =>
  filesInDirectory(dir).then((files: any) =>
    files.map((f: any) => f.name + f.lastModifiedDate).join()
  );

const watchChanges = (dir: any, lastTimestamp?: string) => {
  timestampForFilesInDirectory(dir).then((timestamp) => {
    if (!lastTimestamp || lastTimestamp === timestamp) {
      setTimeout(() => watchChanges(dir, timestamp), 1000); // retry after 1s
    } else {
      chrome.runtime.reload();
    }
  });
};

chrome.management.getSelf((self) => {
  if (self.installType === 'development') {
    chrome.runtime.getPackageDirectoryEntry((dir) => watchChanges(dir));
  }
});
