
export class Chat {

    public name: any[] = [];
    public users: any[] = [];
    public messages: any[] = [];
    public userInfo: any[] = [];

    constructor(obj?: any) {
        this.name = obj ? obj.name : '';
        this.users = obj ? obj.users : [];
        this.messages = obj ? obj.messages : [];
        this.userInfo = obj ? obj.userInfo : [];
    }

    public toJson() {
        return {
            name: this.name,
            users: this.users,
            messages: this.messages,
            userInfo: this.userInfo,
        }
    }

}