import { useEffect } from 'react';

const usePageTitle = (title) => {
  useEffect(() => {
    document.title = `FitNexus - ${title}`;
  }, [title]);
};

export default usePageTitle;