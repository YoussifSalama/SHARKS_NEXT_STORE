"use client";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

type Props = {
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    settings: {
        page: number;
        limit: number;
        order: "asc" | "desc";
    };
    setSearch: (search: string) => void;
    setApplySearch: (applySearch: number) => void;
    setSettings: React.Dispatch<React.SetStateAction<{
        page: number;
        limit: number;
        order: "asc" | "desc";
    }>>;
};

const Paginations = ({ meta, settings, setSettings, setSearch, setApplySearch }: Props) => {
    const { page, totalPages, hasNext, hasPrev } = meta;

    const [searchTerm, setSearchTerm] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };

    const onSearchClick = () => {
        if (!searchTerm.trim()) {
            inputRef.current?.focus();
            return;
        }
        setSearch(searchTerm);
        setApplySearch(Math.random());
    };


    return (
        <div className="w-full flex gap-4 flex-row-reverse flex-wrap justify-between mb-4 items-center">
            {/* Pagination Links */}
            <div>
                <Pagination>
                    <PaginationContent>
                        {hasPrev && (
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={() =>
                                        setSettings((prev) => ({ ...prev, page: prev.page - 1 }))
                                    }
                                />
                            </PaginationItem>
                        )}

                        {getPageNumbers().map((pg) => (
                            <PaginationItem key={pg}>
                                <PaginationLink
                                    href="#"
                                    isActive={pg === page}
                                    onClick={() =>
                                        setSettings((prev) => ({ ...prev, page: pg }))
                                    }
                                >
                                    {pg}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        {hasNext && (
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={() =>
                                        setSettings((prev) => ({ ...prev, page: prev.page + 1 }))
                                    }
                                />
                            </PaginationItem>
                        )}
                    </PaginationContent>
                </Pagination>
            </div>

            {/* Sort Order */}
            <div className="flex gap-4">
                <Select
                    value={settings.order}
                    onValueChange={(val: "asc" | "desc") =>
                        setSettings((prev) => ({ ...prev, order: val }))
                    }
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select an order" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Order</SelectLabel>
                            <SelectItem value="asc">Asc</SelectItem>
                            <SelectItem value="desc">Desc</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <div className="flex ">
                    <Input
                        ref={inputRef}
                        type="search"
                        placeholder="Search with category title or slogan...."
                        className="rounded-r-none"
                        value={searchTerm}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSearchTerm(value);

                            if (value.trim() === "") {
                                setSearch("");
                                setApplySearch(Math.random());
                                setSettings(prev => ({ ...prev, page: 1, order: "asc" }));
                            }
                        }}
                    />

                    <Button
                        variant="outline"
                        className="rounded-l-none"
                        onClick={onSearchClick}
                    >
                        Search
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Paginations;
