import React from 'react';
import { CreditForm } from './credit-form';

const DEFAULT_PRODUCTS: any[] = [];

const useElementResize = (callback: any) => {
  const elementRef = React.useRef(null);

  React.useEffect(() => {
    const resizeObserver = new ResizeObserver(callback);
    if (elementRef.current) {
      resizeObserver.observe(elementRef.current);
    }
    return () => {
      if (elementRef.current) {
        resizeObserver.unobserve(elementRef.current);
      }
    };
  }, [callback]);

  return elementRef;
};

function App() {
  const [products, setProducts] = React.useState(DEFAULT_PRODUCTS);
  const [domain, setDomain] = React.useState<undefined | string>();

  React.useEffect(() => {
    window.addEventListener("message", function(event) {
      try {
        if (typeof event.data !== 'string') {
          return;
        }
        const obj = JSON.parse(decodeURIComponent(event.data));
        if (obj?.length > 0) {
          setProducts(obj);
        }
        if (obj?.products?.length > 0) {
          setProducts(obj.products);
        }
        if (obj?.domain) {
          setDomain(obj.domain);
        }
      } catch (e) {
        console.error(e);
      }
    });

  },[]);

  const handleResize = (entries: any[]) => {
    entries.forEach((entry) => {
      // Perform actions based on the element size changes
      window.parent?.postMessage(JSON.stringify(entry.target.getBoundingClientRect()), "*");
    });
  };

  const elementRef = useElementResize(handleResize);
  return (
    <div className="app-wrapper">
      <CreditForm ref={elementRef} products={products} domain={domain} />
    </div>
  );
}

export default App;
