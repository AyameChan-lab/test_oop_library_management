// -------------------------
// Interface (พฤติกรรมของสิ่งที่ยืมได้)
// -------------------------
interface Borrowable {
    borrow(memberName: string): string;
    returnItem(): string;
    isAvailable(): boolean;
}

// -------------------------
// Abstract Class (Inheritance + Encapsulation)
// -------------------------
abstract class LibraryItem implements Borrowable {
    private _title: string;
    protected readonly itemId: string;
    private _available: boolean = true;

    constructor(title: string, itemId: string) {
        this._title = title;
        this.itemId = itemId;
    }

    public title(): string {
        return this._title;
    }

    public getItemId(): string {
        return this.itemId;
    }

    public available(available: boolean): void {
        this._available = available;
    }

    public isAvailable(): boolean {
        return this._available;
    }

    public borrow(memberName: string): string {
        if (!this._available) {
            return `❌ Item "${this._title}" is already borrowed.`;
        }
        this._available = false;
        return `✅ Item "${this._title}" borrowed by ${memberName}`;
    }

    public returnItem(): string {
        if (this._available) {
            return `⚠️ Item "${this._title}" was not borrowed.`;
        }
        this._available = true;
        return `🔄 Item "${this._title}" returned`;
    }

    public abstract getDetails(): string; // สำหรับ override ใน subclass
}

// -------------------------
// Subclass ตัวอย่าง
// -------------------------
class LightNovel extends LibraryItem {
    private author: string;

    constructor(title: string, itemId: string, author: string) {
        super(title, itemId);
        this.author = author;
    }

    public getDetails(): string {
        return `LightNovel: ${this.title()} by ${this.author} (ID: ${this.getItemId()})`;
    }
}

class Manga extends LibraryItem {
    private issueDate: string;

    constructor(title: string, itemId: string, issueDate: string) {
        super(title, itemId);
        this.issueDate = issueDate;
    }

    public getDetails(): string {
        return `Manga: ${this.title()} Issue: ${this.issueDate} (ID: ${this.getItemId()})`;
    }
}

class Fiction extends LibraryItem {
    private duration: number;

    constructor(title: string, itemId: string, duration: number) {
        super(title, itemId);
        this.duration = duration;
    }

    public getDetails(): string {
        return `Fiction: ${this.title()} Duration: ${this.duration} days (ID: ${this.getItemId()})`;
    }
}


class LibraryMember {
    private _memberName: string;
    private _memberId: string;
    private _borrowedItems: LibraryItem[] = [];

    constructor(memberName: string, memberId: string) {
        this._memberName = memberName;
        this._memberId = memberId;
    }

    public memberName(): string {
        return this._memberName;
    }

    public getMemberId(): string {
        return this._memberId;
    }

    public borrowItem(item: LibraryItem): string {
        if (!item.isAvailable()) {
            return `❌ Item not available`;
        }
        const msg = item.borrow(this._memberName);
        this._borrowedItems.push(item);
        return msg;
    }

    public returnItem(itemId: string): string {
        const index = this._borrowedItems.findIndex(i => i.getItemId() === itemId);
        if (index === -1) {
            return `⚠️ Item with ID ${itemId} is not in ${this._memberName}'s borrowed list.`;
        }
        const item = this._borrowedItems[index];
        const msg = item.returnItem();
        this._borrowedItems.splice(index, 1);
        return msg;
    }

    public listBorrowedItems(): string {
        if (this._borrowedItems.length === 0) return "No items borrowed.";
        return this._borrowedItems.map(i => i.getDetails()).join("\n");
    }
}


class Library {
    private items: Map<string, LibraryItem> = new Map();
    private members: Map<string, LibraryMember> = new Map();

    public addItem(item: LibraryItem): void {
        this.items.set(item.getItemId(), item);
    }

    public addMember(member: LibraryMember): void {
        this.members.set(member.getMemberId(), member);
    }

    public findMemberById(memberId: string): LibraryMember | undefined {
        return this.members.get(memberId);
    }

    public borrowItem(memberId: string, itemId: string): string {
        const member = this.findMemberById(memberId);
        const item = this.items.get(itemId);
        if (!member) return `❌ Member ${memberId} not found`;
        if (!item) return `❌ Item ${itemId} not found`;
        return member.borrowItem(item);
    }

    public returnItem(memberId: string, itemId: string): string {
        const member = this.findMemberById(memberId);
        if (!member) return `❌ Member ${memberId} not found`;
        return member.returnItem(itemId);
    }

    public getLibrarySummary(): string {
        const itemSummary = [...this.items.values()]
            .map(i => i.getDetails())
            .join("\n");
        const memberSummary = [...this.members.values()]
            .map(m => m.memberName())
            .join(", ");
        return `📚 Library Items:\n${itemSummary}\n\n👥 Members:\n${memberSummary}`;
    }
}

const library = new Library();
const lightNovel = new LightNovel("Secrets of the Slient Witch", "L001", "Matsuri Isora");
const manga = new Manga("bocchi the rock", "M001", "2023-09");
const fiction = new Fiction("The Last Wish", "F001", 7);

const member = new LibraryMember("SomChai", "MEM001");

library.addItem(lightNovel);
library.addItem(manga);
library.addItem(fiction);
library.addMember(member);

console.log(library.borrowItem("MEM001", "L001")); 
console.log(member.listBorrowedItems());
console.log(library.returnItem("MEM001", "L001"));
console.log(member.listBorrowedItems());
console.log(fiction.getDetails())
