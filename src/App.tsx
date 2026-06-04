/**
 * App — entry component. Renders the SpeakX-style app shell (4 tabs).
 * Home = the English Town map; Membership / AI Call / Progress are prototypes.
 */
import React from 'react';
import AppTabs from './navigation/AppTabs';

export default function App() {
  return <AppTabs />;
}
