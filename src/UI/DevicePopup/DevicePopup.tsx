import { useEffect, useState } from "react";

function DevicePopup({
    userId,
    devices,
    setDevices,
    onRemoveDevice,
    onCancel,
}: {
    userId: string;
    devices: any[];
    setDevices: React.Dispatch<React.SetStateAction<any[]>>;
    onRemoveDevice: (userId: string, deviceId: string) => any;
    onCancel: () => void;
}) {
    const [removingDeviceId, setRemovingDeviceId] = useState<string | null>(
        null
    );

    useEffect(() => {
        if (devices.length === 0) {
            onCancel();
        }
    });

    const handleRemoveDevice = async (deviceId: string) => {
        setRemovingDeviceId(deviceId); // Show loading spinner for this device
        // Update UI immediately

        // Make API call to remove the device
        const response = await onRemoveDevice(userId, deviceId);
        setDevices((prev) =>
            prev.filter((device) => device.deviceId !== deviceId)
        );
        setRemovingDeviceId(null); // Reset loading state
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-lg font-semibold text-gray-700">
                    Logged-in Devices
                </h3>
                <ul className="mb-4 max-h-64 overflow-auto border border-gray-300 rounded-lg">
                    {devices.map((device) => (
                        <li
                            key={device.deviceId}
                            className="flex items-center justify-between border-b p-4 last:border-b-0"
                        >
                            <div>
                                <p className="text-sm text-gray-600">
                                    {device.userAgent}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {device.ipAddress}
                                </p>
                            </div>
                            <button
                                className={`ml-4 rounded-lg px-3 py-1 text-sm ${
                                    removingDeviceId === device.deviceId
                                        ? "bg-gray-400 text-gray-800 cursor-not-allowed"
                                        : "bg-red-600 text-white hover:bg-red-700"
                                }`}
                                onClick={() =>
                                    handleRemoveDevice(device.deviceId)
                                }
                                disabled={removingDeviceId === device.deviceId}
                            >
                                {removingDeviceId === device.deviceId
                                    ? "Removing..."
                                    : "Remove"}
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="flex justify-end">
                    <button
                        className="rounded-lg bg-gray-300 px-4 py-2 text-sm text-gray-700 shadow hover:bg-gray-400"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DevicePopup;
