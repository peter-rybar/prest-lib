/// <reference path="../../../src/prest/prest-widgets.ts" />

module notifs {

    import Widget = prest.widgets.Widget;
    import element = prest.widgets.element;


    export const TYPE_SUCCESS = 'success';
    export const TYPE_INFO = 'info';
    export const TYPE_WARNING = 'warning';
    export const TYPE_DANGER = 'danger';


    export interface Notif {
        type:string;
        title:string;
        text:string;
    }


    export class NotifWidget implements Widget {

        private _element:HTMLElement;
        private _notif:Notif;

        constructor(notif:Notif) {
            this.setNotif(notif);
        }

        getNotif():Notif {
            return this._notif;
        }

        setNotif(notif:Notif) {
            this._notif = notif;
            return this;
        }

        element():HTMLElement {
            if (!this._element) {
                var notification = this._notif;
                this._element = element(`
                    <div class="alert alert-dismissible alert-${notification.type}"
                         role="${notification.type}">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        </button>
                        <strong>${notification.title || '' }</strong>
                        ${notification.text || ''}
                    </div>`);
            }
            return this._element;
        }

    }


    export class NotifsWidget implements Widget {

        private _element:HTMLElement;
        private _notifWidgets:NotifWidget[] = [];

        getNotifWidgets():NotifWidget[] {
            return this._notifWidgets;
        }

        addNotif(notif:Notif) {
            var n = new NotifWidget(notif);
            this._notifWidgets.push(n);
            this._element.appendChild(n.element());
            return this;
        }

        empty() {
            this._element.innerHTML = '';
            this._notifWidgets = [];
        }

        element():HTMLElement {
            var e = element('<div class="notifications"></div>');
            this._element = e;
            return e;
        }

    }

}
