import { cn } from "@/lib/utils"
import { ArrowUpRight } from "lucide-react"

interface ButtonColorfulProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string
}

export function ButtonColorful({
    className,
    label = "Explore Components",
    disabled,
    ...props
}: ButtonColorfulProps) {
    return (
        <div
            className={cn(
                "relative inline-flex rounded-full p-[1.5px] transition-all duration-300 group/btn",
                disabled
                    ? "bg-m3-outline-variant"
                    : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
                className,
            )}
        >
            {/* Inner button — white fill masks the wrapper, only the 1.5px edge shows as stroke */}
            <button
                type="button"
                className={cn(
                    "relative h-10 px-5 rounded-full transition-all duration-300",
                    "disabled:cursor-not-allowed",
                    // White fill to create the "transparent" look (masks gradient wrapper)
                    // On hover when enabled, hide the white fill to reveal gradient wrapper
                    disabled
                        ? "bg-white"
                        : "bg-white group-hover/btn:bg-transparent",
                )}
                disabled={disabled}
                {...props}
            >
                {/* Content */}
                <div className="relative flex items-center justify-center gap-2">
                    {disabled && (
                        <>
                            <span className="font-medium text-m3-outline">{label}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-m3-outline" />
                        </>
                    )}

                    {!disabled && (
                        <>
                            {/* Default: gradient text */}
                            <span className="font-medium bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent group-hover/btn:opacity-0 transition-opacity duration-300">
                                {label}
                            </span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-purple-500 group-hover/btn:opacity-0 transition-opacity duration-300" />

                            {/* Hover: white text */}
                            <span className="absolute inset-0 flex items-center justify-center gap-2 font-medium text-white opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300">
                                {label}
                                <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                            </span>
                        </>
                    )}
                </div>
            </button>
        </div>
    )
}
