/**
 * App — entry component. Renders the SpeakX-style app shell (4 tabs).
 * Home = the English Town map; Membership / AI Call / Progress are prototypes.
 */
import React, { useEffect } from 'react';
import AppTabs from './navigation/AppTabs';
import { initSound } from './services/soundService';

export default function App() {
  useEffect(() => {
    // load the saved mute preference + configure the audio session once
    void initSound();
  }, []);
  return <AppTabs />;
}
