import { Form, useActionData } from "react-router";
import { useState } from "react";
import { XMarkIcon } from "~/components/Icons/XMarkIcon";
import { BanIcon } from "~/components/Icons/BanIcon";
import { EyeClosedIcon } from "~/components/Icons/EyeClosedIcon";
import { EyeOpenIcon } from "~/components/Icons/EyeOpenIcon";
import { RefreshIcon } from "~/components/Icons/RefreshIcon";
import { CheckMarkIcon } from "~/components/Icons/CheckMarkIcon";

export default function UserInviteForm({ user, invite }: any) {
  const actionData = useActionData();
  const [visible, setVisible] = useState<{ [key: string]: boolean }>({});

  const toggleVisibility = (id: string) => {
    setVisible((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-8">
      <div className="border-l-4 border-indigo-500 pl-6">
        <h3 className="text-3xl font-bold text-gray-900 mb-1">
          Invite Friends & Family
        </h3>
        <p className="text-gray-500 text-sm">
          Use your invite keys to add family and friends to your account.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">
            Send an Invite
          </h4>
          <p className="text-sm text-gray-500">
            Enter the email of the person you want to invite.
          </p>
        </div>

        <Form
          method="post"
          action="/dashboard/settings?tab=invites"
          className="space-y-5"
        >
          <input type="hidden" name="intent" value="create-invite" />
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="friend@example.com"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900
                         shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500
                         focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold 
                       py-3 rounded-xl shadow-md transition-all active:scale-95"
          >
            Generate Invite Key
          </button>
        </Form>
      </div>

      <div className="bg-gray-50 space-y-4 rounded-xl">
        {actionData?.error && (
          <div className="p-3 ml-29 text-center rounded-lg bg-red-100 w-90 border border-red-300 text-red-700">
            {actionData.error}
          </div>
        )}

        <h4 className="text-lg font-semibold text-gray-900">Your Invites</h4>

        <div className="space-y-4">
          {invite?.length === 0 && (
            <p className="text-gray-500 text-sm">No invites created yet.</p>
          )}

          {invite?.map((inv: any) => {
            const show = visible[inv.id];

            return (
              <div
                key={inv.id}
                className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
              >
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div>
                    <p className="text-sm text-gray-900 font-semibold">
                      {inv.email}
                    </p>
                    <div className="text-xs text-gray-500 w-[300px] flex flex-col">
                      <span>
                        Created: {new Date(inv.createdAt).toLocaleString()}
                      </span>
                      <span>
                        Updated: {new Date(inv.updatedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="w-[500px]">
                      <p className="font-mono rounded-full bg-gray-400 text-sm text-black px-2 py-1 ml-10">
                        {show ? (
                          <p className="text-center">{inv.code}</p>
                        ) : (
                          <p className="text-center">**********</p>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => toggleVisibility(inv.id)}
                      className="rounded-lg hover:bg-gray-100 transition"
                      title={show ? "Hide code" : "Show code"}
                      aria-label={show ? "Hide code" : "Show code"}
                    >
                      {show ? (
                        <EyeClosedIcon className="text-gray-700 size-6" />
                      ) : (
                        <EyeOpenIcon className="text-gray-700 size-6" />
                      )}
                    </button>

                    <Form
                      method="post"
                      action="/dashboard/settings?tab=invites"
                    >
                      <input
                        type="hidden"
                        name="intent"
                        value="regenerate-invite"
                      />
                      <input type="hidden" name="id" value={inv.id} />
                      <button
                        type="submit"
                        className="rounded-lg hover:bg-blue-100 transition"
                      >
                        <RefreshIcon className="text-blue-600 size-6" />
                      </button>
                    </Form>

                    {inv.isActive ? (
                      <Form
                        method="post"
                        action="/dashboard/settings?tab=invites"
                      >
                        <input
                          type="hidden"
                          name="intent"
                          value="disable-invite"
                        />
                        <input type="hidden" name="id" value={inv.id} />
                        <button
                          type="submit"
                          className="rounded-lg hover:bg-yellow-100 transition"
                        >
                          <BanIcon className="text-yellow-600 size-6" />
                        </button>
                      </Form>
                    ) : (
                      <Form
                        method="post"
                        action="/dashboard/settings?tab=invites"
                      >
                        <input
                          type="hidden"
                          name="intent"
                          value="enable-invite"
                        />
                        <input type="hidden" name="id" value={inv.id} />
                        <button
                          type="submit"
                          className="rounded-lg hover:bg-green-100 transition"
                        >
                          <CheckMarkIcon className="text-green-600 size-7" />
                        </button>
                      </Form>
                    )}

                    <Form
                      method="post"
                      action="/dashboard/settings?tab=invites"
                    >
                      <input
                        type="hidden"
                        name="intent"
                        value="delete-invite"
                      />
                      <input type="hidden" name="id" value={inv.id} />
                      <button
                        type="submit"
                        className="rounded-lg hover:bg-red-100 transition"
                      >
                        <XMarkIcon className="text-red-600 size-6" />
                      </button>
                    </Form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
