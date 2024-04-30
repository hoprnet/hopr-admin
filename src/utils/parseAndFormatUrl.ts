  export const parseAndFormatUrl = (url: string) => {

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url;
    }
    const parts = url.split('/');
    let hostAndPort = parts[2]; // Get the part that contains the host and port

    parts[2] = hostAndPort;
    try {
      new URL(parts.join('/'));
      return parts.join('/');
    } catch (e) {
      return null;
    }
  };