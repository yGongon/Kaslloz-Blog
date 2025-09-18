import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { SiteConfig } from '../types';
import { db } from '../firebase/config';
import { ref, onValue, set, get } from 'firebase/database';

interface SiteConfigContextType {
  siteConfig: SiteConfig;
  updateSiteConfig: (newConfig: Partial<SiteConfig>) => Promise<void>;
  loading: boolean;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

const DEFAULT_CONFIG: SiteConfig = {
  clipOfTheWeek: {
    title: 'Play da Semana',
    youtubeId: 'v3hM4i32Y4I',
  },
};

export const SiteConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const configRef = ref(db, 'site_config');
    const unsubscribe = onValue(configRef, (snapshot) => {
      if (snapshot.exists()) {
        setSiteConfig(snapshot.val());
      } else {
        // If config doesn't exist in DB, use default. Admin can create it by saving.
        setSiteConfig(DEFAULT_CONFIG);
      }
      setLoading(false);
    }, (error) => {
      console.error(
        "ACTION REQUIRED: Could not read site config. This is likely a Firebase rules issue. " +
        "Please deploy the `database.rules.json` file to your Firebase project by running `firebase deploy --only database` in your terminal. " +
        "Using default config as a fallback.", 
        error
      );
      setSiteConfig(DEFAULT_CONFIG);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateSiteConfig = useCallback(async (newConfig: Partial<SiteConfig>) => {
    try {
      const configRef = ref(db, 'site_config');
      // Fetch current config to merge with new partial config
      const snapshot = await get(configRef);
      const currentConfig = snapshot.exists() ? snapshot.val() : DEFAULT_CONFIG;
      const updatedConfig = { ...currentConfig, ...newConfig };
      await set(configRef, updatedConfig);
    } catch (error) {
      console.error("Error updating site config: ", error);
    }
  }, []);
  
  const value = useMemo(() => ({ siteConfig, updateSiteConfig, loading }), [siteConfig, updateSiteConfig, loading]);

  return (
    <SiteConfigContext.Provider value={value}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = (): SiteConfigContextType => {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }
  return context;
};
