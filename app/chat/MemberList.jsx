import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function MembersList({ members }) {
    return (
        <ScrollArea className="h-[300px] md:h-[400px]">
            <ul>
                {Object.keys(members).map((member, index) => (
                    <li
                        key={index}
                        className="mb-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md cursor-pointer transition-colors duration-200 flex items-center"
                    >
                        <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage
                                src={`https://api.dicebear.com/6.x/initials/svg?seed=${members[member].nickname}`}
                            />
                            <AvatarFallback>{members[member].nickname.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        {members[member].nickname}
                    </li>
                ))}
            </ul>
        </ScrollArea>
    );
}
