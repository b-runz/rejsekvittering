
import html2canvas from 'html2canvas';

function createCanvas(identity: string): {promiseCanvas: Promise<HTMLCanvasElement>, clonedElement: HTMLElement} {
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
    return {promiseCanvas: html2canvas(clonedElement), clonedElement: clonedElement};
}

export function printPicture(identity: string, fileName: string) {
    const { promiseCanvas, clonedElement } = createCanvas(identity)
    promiseCanvas.then(canvas=>{
            const dataURL = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.href = dataURL;
            downloadLink.download = `${fileName}.png`;
            downloadLink.click();
            clonedElement.remove();
        })
}

export async function getPictureBytes(identity:string) : Promise<Uint8Array> {
    const { promiseCanvas, clonedElement } = createCanvas(identity);
    const canvas = await promiseCanvas;

    const dataURL = canvas.toDataURL('image/png');
    const byteString = atob(dataURL.split(',')[1]);
    const byteArray = new Uint8Array(byteString.length);

    for (var i = 0; i < byteString.length; i++) {
      byteArray[i] = byteString.charCodeAt(i);
    }

    clonedElement.remove();
    return byteArray
}