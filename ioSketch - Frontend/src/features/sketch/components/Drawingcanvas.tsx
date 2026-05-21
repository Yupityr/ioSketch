import React, { useRef, useEffect, useState, type FC } from 'react';

const DrawingCanvas: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const historyRef = useRef<ImageData[]>([]);
  const canvasOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [brushColor, setBrushColor] = useState<string>('#000000');
  const [brushSize, setBrushSize] = useState<number>(3);
  const [isErasing, setIsErasing] = useState<boolean>(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [canUndo, setCanUndo] = useState<boolean>(false);

  const updateCanvasOffset = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvasOffsetRef.current = {
      x: rect.left,
      y: rect.top,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setContext(ctx);

    historyRef.current = [];
    setCanUndo(false);
    updateCanvasOffset();

    // Handle window resize
    const handleResize = (): void => {
      // Store current drawing
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Resize canvas
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // Restore drawing
      ctx.putImageData(imageData, 0, 0);
      
      // Update offset
      updateCanvasOffset();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const saveHistory = (): void => {
    if (!context || !canvasRef.current) return;
    const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    historyRef.current.push(imageData);
    setCanUndo(true);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!context) return;
    saveHistory();
    setIsDrawing(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    context.beginPath();
    context.moveTo(offsetX, offsetY);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!isDrawing || !context) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    context.lineTo(offsetX, offsetY);

    context.strokeStyle = isErasing ? '#ffffff' : brushColor;
    context.lineWidth = brushSize;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    context.stroke();
  };

  const stopDrawing = (): void => {
    if (context) {
      context.closePath();
    }
    setIsDrawing(false);
  };

  const undo = (): void => {
    if (historyRef.current.length === 0 || !context || !canvasRef.current) return;
    const previousState = historyRef.current.pop();
    if (previousState) {
      context.putImageData(previousState, 0, 0);
    }
    if (historyRef.current.length === 0) {
      setCanUndo(false);
    }
  };

  const clearCanvas = (): void => {
    if (context && canvasRef.current) {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      historyRef.current = [];
      setCanUndo(false);
    }
  };

  const exportSketch = (): void => {
    if (canvasRef.current) {
      canvasRef.current.toBlob((blob: Blob | null) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `sketch-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
    }
  };

  const uploadSketch = async (): Promise<void> => {
    if (canvasRef.current) {
      canvasRef.current.toBlob(async (blob: Blob | null) => {
        if (!blob) return;
        const formData = new FormData();
        formData.append('image', blob, 'sketch.png');

        try {
          const response = await fetch('/api/sketches', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            interface SketchResponse {
              cloudinary_url: string;
            }
            const data: SketchResponse = await response.json();
            alert(`Sketch uploaded! URL: ${data.cloudinary_url}`);
          } else {
            alert('Upload failed');
          }
        } catch (error) {
          console.error('Upload error:', error);
          alert(`Upload error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-linear-to-br from-slate-800 via-slate-800 to-slate-900 min-h-screen items-center justify-center overflow-hidden">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Color Picker */}
        <div className="flex items-center gap-2">
          <label htmlFor="color-picker" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Color
          </label>
          <input
            id="color-picker"
            type="color"
            value={brushColor}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setBrushColor(e.target.value);
              setIsErasing(false);
            }}
            className="w-12 h-10 cursor-pointer rounded-md border-0"
          />
        </div>

        {/* Brush Size */}
        <div className="flex items-center gap-2">
          <label htmlFor="brush-size" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Brush size
          </label>
          <input
            id="brush-size"
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBrushSize(Number(e.target.value))}
            className="w-32 cursor-pointer"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{brushSize}px</span>
        </div>

        {/* Erase Button */}
        <button
          onClick={() => setIsErasing(!isErasing)}
          className={`px-4 py-2 rounded-md font-medium transition-colors text-sm ${
            isErasing
              ? 'bg-amber-500 text-white hover:bg-amber-600'
              : 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600'
          }`}
        >
          Erase
        </button>

        {/* Undo Button */}
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`px-4 py-2 rounded-md font-medium transition-colors text-sm ${
            canUndo
              ? 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50 dark:bg-gray-800 dark:text-gray-600'
          }`}
        >
          Undo
        </button>

        {/* Clear Button */}
        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-gray-200 text-gray-900 hover:bg-gray-300 rounded-md font-medium transition-colors text-sm dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
        >
          Clear
        </button>

        {/* Download Button */}
        <button
          onClick={exportSketch}
          className="px-4 py-2 bg-gray-200 text-gray-900 hover:bg-gray-300 rounded-md font-medium transition-colors text-sm dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
        >
          Download
        </button>

        {/* Upload Button */}
        <button
          onClick={uploadSketch}
          className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md font-medium transition-colors text-sm"
        >
          Upload
        </button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="relative h-120 md:h-200 w-80 h-2xs sm:w-2xl border-2 border-gray-300 rounded-lg cursor-crosshair bg-white dark:border-gray-600"
      />
    </div>
  );
};

export default DrawingCanvas;