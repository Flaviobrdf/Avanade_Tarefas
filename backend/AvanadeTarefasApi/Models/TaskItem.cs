namespace AvanadeTarefasApi.Models
{
    public class TaskItem
    {
        // public int Id { get; set; }
        // public string Title { get; set; } = string.Empty;
        // public string Description { get; set; } = string.Empty;
        // public bool IsCompleted { get; set; }

        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int UserId { get; set; }
        public bool Completed { get; set; }
        public DateTime? DtCriacao { get; set; }

        //public int UserId { get; set; }
        public User? User { get; set; }
    }
}
