'use client'

import { ReactElement } from "react"
import html2canvas from 'html2canvas';

interface ButtonProps {
    identity: string
}

export default function PrintButton({ identity }: ButtonProps): ReactElement<any, any> {
    return (
        <button onClick={() => {
            const element = document.getElementById(identity)!;
            const clonedElement = element.cloneNode(true) as HTMLElement;
            clonedElement.style.position = "absolute";
            clonedElement.style.zIndex = "-1"
            document.body.prepend(clonedElement);

            const childNodeId = `b_${identity}`;

            const childNode = clonedElement.querySelector(`[id=${childNodeId}]`);
            console.log(clonedElement)

            if (childNode) {
                childNode.remove()
            }

            const classList = Array.from(element.classList);
            const updatedClassList = classList.filter(className => className !== 'shadow-md');
            clonedElement.className = updatedClassList.join(' ');

            html2canvas(clonedElement).then(canvas => {
                const dataURL = canvas.toDataURL('image/png');
                const downloadLink = document.createElement('a');
                downloadLink.href = dataURL;
                downloadLink.download = 'captured_image.png';
                downloadLink.click();
            })
            clonedElement.remove();

        }} id={"b_" + identity}>Print</button>
    )
}