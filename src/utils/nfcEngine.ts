/**
 * Web NFC writer and NDEF tag programming assistant.
 */

export interface NfcSupportStatus {
  isSupported: boolean;
  reason?: string;
}

/**
 * Checks if the current browser and device support the Web NFC API.
 */
export function checkNfcSupport(): NfcSupportStatus {
  if (typeof window === 'undefined') {
    return { isSupported: false, reason: 'Server environment' };
  }

  if (!('NDEFReader' in window)) {
    return {
      isSupported: false,
      reason: 'Web NFC is supported primarily in Chrome for Android (v89+). iOS Safari and desktop browsers do not allow Web NFC in browsers yet. You can use free apps like "NFC Tools" on any smartphone to program your tag in 10 seconds.',
    };
  }

  return { isSupported: true };
}

/**
 * Attempts to write an NDEF URL record to an NFC tag using Web NFC.
 */
export async function writeNfcUrl(
  url: string,
  onStatusUpdate?: (status: string) => void
): Promise<{ success: boolean; message: string }> {
  const support = checkNfcSupport();
  if (!support.isSupported) {
    throw new Error(support.reason || 'Web NFC is not supported on this browser.');
  }

  try {
    // @ts-ignore - Web NFC types
    const ndef = new window.NDEFReader();
    onStatusUpdate?.('Ready! Bring your NFC card or tag close to the back of your phone...');

    await ndef.write({
      records: [
        {
          recordType: 'url',
          data: url,
        },
      ],
    });

    return {
      success: true,
      message: 'Successfully written URL to NFC tag! Tap it with any smartphone to open your profile.',
    };
  } catch (err: any) {
    if (err.name === 'NotAllowedError') {
      throw new Error('NFC permission was denied by the user.');
    } else if (err.name === 'NotSupportedError') {
      throw new Error('This NFC tag or device does not support NDEF writing.');
    } else {
      throw new Error(err.message || 'Failed to write to NFC tag.');
    }
  }
}
