import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import WebViewer to avoid SSR issues
const WebViewerComponent = dynamic(
  () => import('@pdftron/webviewer').then((mod) => {
    // Return a wrapper component
    return ({ elementRef, options, onReady }) => {
      // Use useEffect to initialize WebViewer
      useEffect(() => {
        if (!elementRef.current) return;
        
        let instance = null;
        
        const initialize = async () => {
          try {
            instance = await mod.default(options, elementRef.current);
            if (onReady) onReady(instance);
          } catch (error) {
            console.error('Error initializing WebViewer:', error);
          }
        };
        
        initialize();
        
        // Cleanup
        return () => {
          if (instance) {
            instance.dispose();
          }
        };
      }, [elementRef, options, onReady]);
      
      // Return a div for WebViewer to attach to
      return <div className="h-full w-full" ref={elementRef}></div>;
    };
  }),
  { ssr: false } // Important: Disable SSR for this component
);

const PDFViewer = ({ fileUrl }) => {
  const viewerRef = useRef(null);
  const [error, setError] = useState(null);
  
  const handleReady = (instance) => {
    const { docViewer } = instance;
    
    // Enable streaming
    docViewer.setOptions({ streaming: true });
    
    // Listen for errors
    docViewer.on('documentError', (error) => {
      console.error('Document error:', error);
      setError('Failed to load the PDF. Please check if the file exists and is accessible.');
    });
  };
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 p-8">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
          <div className="text-red-500 text-xl mb-4">Error Loading PDF</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => setError(null)} 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full">
      <WebViewerComponent
        elementRef={viewerRef}
        options={{
          path: '/webviewer',
          initialDoc: fileUrl,
          extension: 'pdf',
          disabledElements: [
            'downloadButton',
            'printButton'
          ],
          useDownloader: false,
          enableAnnotations: false,
          fullAPI: false, // Set to true only if you need the full API
        }}
        onReady={handleReady}
      />
    </div>
  );
};

export default PDFViewer;