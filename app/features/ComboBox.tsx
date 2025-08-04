"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useController, useFormContext } from "react-hook-form"
import Loader from "../sharks-dashboard-2025/features/Loader"

type ComboBoxItem = {
    id: number
    title: string
    img: string
}

interface ComboBoxProps {
    name: string
    getItems: (search: string) => Promise<ComboBoxItem[]>,
    defaultValue?: {
        title: string,
        id: number,
        img: string
    }
}

export function ComboBox({ name, getItems, defaultValue }: ComboBoxProps) {
    const [open, setOpen] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState<ComboBoxItem>({ id: 0, title: "", img: "" });
    const [foundItems, setFoundItems] = React.useState<ComboBoxItem[]>([])
    const [loading, setLoading] = React.useState(false)
    const [search, setSearch] = React.useState("")

    const { control } = useFormContext()
    const {
        field: { value, onChange },
    } = useController({ name, control })

    const fetchItems = React.useCallback(
        async (term: string) => {
            setLoading(true)
            try {
                const items = await getItems(term)
                setFoundItems(items)
            } finally {
                setLoading(false)
            }
        },
        [getItems]
    )

    React.useEffect(() => {
        if (open) {
            fetchItems("")
        } else {
            setFoundItems([])
            setSearch("")
        }
    }, [open, fetchItems])

    React.useEffect(() => {
        if (!open) return

        const delayDebounce = setTimeout(() => {
            fetchItems(search)
        }, 500)

        return () => clearTimeout(delayDebounce)
    }, [search, open, fetchItems])

    React.useEffect(() => {
        if (defaultValue) {
            setSelectedItem(defaultValue);
        }
    }, [defaultValue])



    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {(Number(value) == Number(selectedItem.id))
                        ? selectedItem?.title || "Selected item not in list"
                        : `Select ${name.split("Id")[0]}...`}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput
                        placeholder={`Search ${name.split("Id")[0]}...`}
                        className="h-9"
                        value={search}
                        onValueChange={(val) => setSearch(val)}
                        autoFocus
                    />
                    <CommandList
                        style={{ maxHeight: 200, overflowY: "auto" }}
                    >
                        {loading ? (
                            <CommandEmpty className="flex items-center justify-center p-4">
                                <Loader classname="w-4 h-4" />
                            </CommandEmpty>
                        ) :
                            foundItems.length === 0 ? (
                                <CommandEmpty>No {name.split("Id")[0]} found.</CommandEmpty>
                            ) : (
                                <div className="p-2 space-y-2">
                                    {foundItems.map((item) => (
                                        <button
                                            key={item.id}
                                            className={`w-full flex items-center gap-2 text-left px-2 py-1 rounded hover:bg-gray-200 ${value === item.id ? "font-bold bg-gray-300" : ""
                                                }`}
                                            onClick={() => {
                                                onChange(item.id);
                                                setSelectedItem(item);
                                                setOpen(false)
                                            }}
                                            type="button"
                                        >
                                            <img className="w-8 h-8 rounded-md shadow-md object-cover" src={item.img} loading="lazy" alt={name.split("Id")[0] + "-img"} />
                                            <span>{item.title}</span>
                                        </button>
                                    ))}
                                </div>

                            )

                        }
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
