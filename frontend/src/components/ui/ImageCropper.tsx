"use client"

import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { getCroppedImg } from "@/lib/cropImage"
import { Slider } from "@radix-ui/react-slider" // Assuming radix slider or similar exists

interface ImageCropperProps {
  image: string;
  cropShape?: 'rect' | 'round';
  aspect?: number;
  onCropComplete: (croppedImage: Blob) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function ImageCropper({ image, cropShape = 'round', aspect = 1, onCropComplete, onClose, isOpen }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

  const onCropChange = (crop: any) => {
    setCrop(crop)
  }

  const onCropCompleteInternal = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const onSave = async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels)
      if (croppedImage) {
        onCropComplete(croppedImage)
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl bg-zinc-950 border-white/10 rounded-[2.5rem] p-8">
        <DialogHeader>
          <DialogTitle className="text-3xl font-black italic tracking-tighter uppercase">Adjust Identity Alignment</DialogTitle>
        </DialogHeader>
        
        <div className="relative h-80 w-full bg-zinc-900 rounded-3xl overflow-hidden mt-6">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={cropShape}
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={onCropCompleteInternal}
            onZoomChange={setZoom}
          />
        </div>

        <div className="flex flex-col gap-4 mt-8">
           <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
              <span>Magnification Level</span>
              <span>{Math.round(zoom * 100)}%</span>
           </div>
           <input 
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-primary h-1 bg-zinc-900 rounded-full appearance-none cursor-pointer"
           />
        </div>

        <DialogFooter className="mt-8 flex gap-4">
          <Button variant="ghost" className="rounded-full px-8 text-zinc-500 font-bold uppercase tracking-widest text-[10px]" onClick={onClose}>
            Abort
          </Button>
          <Button className="rounded-full px-10 h-14 font-black uppercase italic shadow-2xl shadow-primary/20" onClick={onSave}>
            Lock Resonance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
