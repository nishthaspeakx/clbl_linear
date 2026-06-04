/**
 * AvatarContext — shares the selected learner avatar across tabs so the map
 * character and the profile/selector stay in sync and update live.
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AvatarSelection, DEFAULT_SELECTION, loadAvatar, saveAvatar } from '../../storage/avatarStorage';

interface AvatarCtx {
  selection: AvatarSelection;
  setSelection: (s: AvatarSelection) => void;
  loaded: boolean;
}

const Ctx = createContext<AvatarCtx>({
  selection: DEFAULT_SELECTION,
  setSelection: () => {},
  loaded: false,
});

export function AvatarProvider({ children }: { children: React.ReactNode }) {
  const [selection, setSel] = useState<AvatarSelection>(DEFAULT_SELECTION);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      setSel(await loadAvatar());
      setLoaded(true);
    })();
  }, []);

  const setSelection = (s: AvatarSelection) => {
    setSel(s);
    saveAvatar(s);
  };

  return <Ctx.Provider value={{ selection, setSelection, loaded }}>{children}</Ctx.Provider>;
}

export function useAvatar(): AvatarCtx {
  return useContext(Ctx);
}
