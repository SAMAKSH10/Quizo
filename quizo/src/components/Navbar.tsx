import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
} from "../components/ui/navigation-menu";

const Navbar = () => {
    return (
        <NavigationMenu className="bg-white border-b border-gray-200">
            <div className="container mx-auto flex items-center justify-between py-4 px-6">
                <NavigationMenuList className="flex items-center space-x-10 justify-center align-center">
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <a href="/" className="text-xl font-bold text-black mr-96 ml-72 justify-center">
                                Quizo
                            </a>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <a href="#" className="text-gray-800 hover:text-gray-600">
                                Home
                            </a>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <a href="#" className="text-gray-800 hover:text-gray-600">
                                About
                            </a>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <a href="#" className="text-gray-800 hover:text-gray-600">
                                Services
                            </a>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <a href="#" className="text-gray-800 hover:text-gray-600">
                                Contact
                            </a>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </div>
        </NavigationMenu>
    );
};

export default Navbar;
