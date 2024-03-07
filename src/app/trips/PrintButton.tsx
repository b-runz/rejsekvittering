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

            const buttonNode = `b_${identity}`;
            const checkboxNode = `ch_${identity}`;

            const buttonChild = clonedElement.querySelector(`[id=${buttonNode}]`);
            const checkboxChild = clonedElement.querySelector(`[id=${checkboxNode}]`);

            if (buttonChild && checkboxChild) {
                buttonChild.remove()
                checkboxChild.remove()
            }

            const classList = Array.from(element.classList);
            let updatedClassList = classList.filter(className => className !== 'shadow-md');
            clonedElement.className = updatedClassList.join(' ');

            updatedClassList = classList.filter(className => className !== 'border-2');
            clonedElement.className = updatedClassList.join(' ');

            html2canvas(clonedElement).then(canvas => {
                const dataURL = canvas.toDataURL('image/png');
                const downloadLink = document.createElement('a');
                downloadLink.href = dataURL;
                downloadLink.download = `${identity}_image.png`;
                downloadLink.click();
            })
            clonedElement.remove();

        }} id={"b_" + identity} className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" style={{marginLeft: 20}}>Print</button>
    )
}