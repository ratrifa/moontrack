
// eslint-disable-next-line react/prop-types
const InputField = ({ label, placeholder, type, value, onChange }) => (
    <div className="flex flex-col">
        <label
            className="text-[#D6D5D5] font-medium mb-2"
            style={{ fontSize: "16px", lineHeight: "25px", letterSpacing: "-0.02em" }}
        >
            {label}
        </label>
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-[280px] h-[40px] bg-[#1C1B1B] text-white px-4 py-2 rounded-[12px] focus:outline-none"
            style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
        />
    </div>
);

export default InputField;