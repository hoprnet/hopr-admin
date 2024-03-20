  export const parseAndFormatUrl = (url: string) => {

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url;
    }
    const parts = url.split('/');
    let hostAndPort = parts[2]; // Get the part that contains the host and port

    if (hostAndPort.indexOf(':') === -1) {
      hostAndPort += ':3001';
    }

    parts[2] = hostAndPort;
    try {
      new URL(parts.join('/'));
      return parts.join('/');
    } catch (e) {
      return null;
    }
  };