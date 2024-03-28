import * as React from 'react';
import MarkdownInput from "@/components/MarkdownInput";

/*https://nextui.org/docs/guide/installation*/

import {NextUIProvider} from "@nextui-org/react"

export default function Home() {
  return (
    <NextUIProvider>
      <div>    
        <h1>Rillkommen</h1>
        <MarkdownInput id='test' />
      </div>
    </NextUIProvider>

  );
}
