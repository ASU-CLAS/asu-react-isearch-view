import IsearchDirectoryWrapperDrupal from './containers/IsearchDirectoryWrapperDrupal';
import { createRoot } from 'react-dom/client';
import "@asu/unity-bootstrap-theme/dist/css/unity-bootstrap-theme.css";

const domNodes = document.getElementsByClassName('clas-isearch-view');

for (let node of domNodes) {
  const root = createRoot(node);
  root.render(<IsearchDirectoryWrapperDrupal dataFromPage={node.dataset} />)
}

