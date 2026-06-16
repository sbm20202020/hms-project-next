import { SidebarInset, SidebarProvider } from "./sidebar";


export default function SkeletonChargement() {
    return (
        <SidebarProvider>
            <SidebarInset>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-5">
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                    </div>
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                    </div>
                    <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
export function SkeletonChargementFileAttente() {
    return (
        <SidebarProvider>
            <SidebarInset>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                        <div className="bg-muted/70 aspect-video rounded-xl" />
                        <div className="bg-muted/100 aspect-video rounded-xl" />
                        <div className="bg-muted/70 aspect-video rounded-xl" />
                        <div className="bg-muted/100 aspect-video rounded-xl" />
                    </div>
                    <div className="grid auto-rows-min gap-2 md:grid-cols-2">
                        <div className="bg-muted/70 h-[200px] w-full rounded-xl" />
                        <div className="bg-muted/70 h-[200px] w-full rounded-xl" />
                    </div>
                    <div className="bg-muted/70 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export function SkeletonChargementStats() {
    return (
        <SidebarProvider>
            <SidebarInset>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
